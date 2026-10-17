/*
 * Copyright 2026 Clancig FullstackWeb
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import dbConnect from '@/lib/mongodb';
import NotificationModel, { INotification } from '@/models/Notification';
import User from '@/models/User';
import mongoose from 'mongoose';

export class NotificationService {
    /**
     * Retrieves a notification by ID strictly for the owner identified by userEmail.
     */
    static async getNotificationForUser(id: string, userEmail: string): Promise<INotification | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }

        try {
            await dbConnect();
            const currentUser = await User.findOne({ email: userEmail }).select('_id').lean();
            if (!currentUser) return null;

            const notification = await NotificationModel.findOne({
                _id: id,
                userId: currentUser._id,
            }).lean();

            if (!notification) return null;

            // Plain serializable object for Client Boundaries / SSR
            return JSON.parse(JSON.stringify(notification)) as INotification;
        } catch (error) {
            console.error("Error in NotificationService.getNotificationForUser:", error);
            return null;
        }
    }
}
