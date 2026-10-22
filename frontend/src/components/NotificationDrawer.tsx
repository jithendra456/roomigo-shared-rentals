import React from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  Bell, 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  Calendar, 
  AlertTriangle, 
  ShieldCheck,
  CheckCheck
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export const NotificationDrawer: React.FC = () => {
  const { notifications, unreadCount, isOpen, closeDrawer, markAsRead, markAllAsRead } = useNotifications();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'LISTING_APPROVED':
        return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      case 'RECONFIRMED':
        return <CheckCircle className="w-4 h-4 text-indigo-500" />;
      case 'ENQUIRY_RECEIVED':
      case 'ENQUIRY_REPLIED':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'VISIT_REQUESTED':
      case 'VISIT_UPDATED':
        return <Calendar className="w-4 h-4 text-violet-500" />;
      case 'EXPIRING_SOON':
      case 'LISTING_EXPIRED':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'LISTING_REJECTED':
      case 'RENTER_REJECTED':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="fixed inset-y-0 right-0 max-w-full flex pl-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-screen max-w-sm bg-white shadow-2xl flex flex-col border-l border-slate-200">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                onClick={closeDrawer}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
            {notifications.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-2">
                <Bell className="w-8 h-8 mx-auto stroke-1 opacity-50" />
                <p className="text-xs">No notifications yet</p>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  You will be notified when your vacancies are approved, reconfirmed, or receive enquiries.
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-3 rounded-xl transition-all ${
                    !n.read ? 'bg-indigo-50/50 hover:bg-indigo-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-lg bg-white shadow-xs border border-slate-100 mt-0.5">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs ${!n.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0"></span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-3">
                        {n.message}
                      </p>
                      {n.link && (
                        <Link
                          to={n.link}
                          onClick={closeDrawer}
                          className="inline-block mt-2 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          View Details →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
