// src/app/api/cron/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin'; // Using admin SDK for backend operations
import type { ScheduledTransaction, Transaction } from '@/lib/types';
import { Timestamp } from 'firebase-admin/firestore';

// Function to add days to a date
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Function to add months to a date
function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

// Function to add years to a date
function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}


function calculateNextDueDate(scheduledTx: ScheduledTransaction): Date {
    const lastProcessed = scheduledTx.lastProcessedDate ? new Date(scheduledTx.lastProcessedDate) : new Date(scheduledTx.startDate);
    
    switch (scheduledTx.frequency) {
        case 'daily':
            return addDays(lastProcessed, 1);
        case 'weekly':
            return addDays(lastProcessed, 7);
        case 'monthly':
            return addMonths(lastProcessed, 1);
        case 'yearly':
            return addYears(lastProcessed, 1);
        default:
            throw new Error(`Unknown frequency: ${scheduledTx.frequency}`);
    }
}


export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const usersSnapshot = await db.collection('users').get();
    const processingPromises: Promise<void>[] = [];

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const scheduledTxsRef = db.collection(`users/${userId}/scheduledTransactions`);
      const scheduledTxsSnapshot = await scheduledTxsRef.get();

      for (const scheduledTxDoc of scheduledTxsSnapshot.docs) {
        const scheduledTx = { id: scheduledTxDoc.id, ...scheduledTxDoc.data() } as ScheduledTransaction;

        const processTransaction = async () => {
            let lastProcessedDate = scheduledTx.lastProcessedDate ? new Date(scheduledTx.lastProcessedDate) : new Date(scheduledTx.startDate);
            const today = new Date();
            today.setHours(0,0,0,0);


            // Ensure start date is not in the future
            if (new Date(scheduledTx.startDate) > today) {
                return;
            }

            while (true) {
                const nextDueDate = calculateNextDueDate(scheduledTx);
                
                if (nextDueDate > today) {
                    break; // Next due date is in the future
                }

                // Check if the schedule has ended
                if (scheduledTx.endDate && nextDueDate > new Date(scheduledTx.endDate)) {
                    break; 
                }

                // Create the new transaction
                const newTransaction: Omit<Transaction, 'id'> = {
                    amount: scheduledTx.amount,
                    categoryId: scheduledTx.categoryId,
                    date: nextDueDate.toISOString(),
                    description: scheduledTx.description,
                    type: scheduledTx.type,
                    accountId: scheduledTx.accountId,
                    creditCardId: scheduledTx.creditCardId,
                };
                await db.collection(`users/${userId}/transactions`).add({
                    ...newTransaction,
                    createdAt: Timestamp.now()
                });
                
                // Update last processed date for the next iteration
                lastProcessedDate = nextDueDate;

                // Update the scheduled transaction with the new lastProcessedDate
                await scheduledTxDoc.ref.update({
                    lastProcessedDate: lastProcessedDate.toISOString(),
                });
            }
        }
        processingPromises.push(processTransaction());
      }
    }
    
    await Promise.all(processingPromises);
    return NextResponse.json({ success: true, message: 'Recurring transactions processed.' });

  } catch (error: any) {
    console.error('Error processing recurring transactions:', error);
    return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
  }
}
