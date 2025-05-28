
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Bell, 
  Check, 
  Users, 
  Trophy, 
  MessageSquare, 
  UserPlus,
  UserMinus,
  Crown
} from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

const NotificationCenter: React.FC = () => {
  const { notifications, loading, unreadCount, markAsRead } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'team_joined':
        return <UserPlus className="w-4 h-4" />;
      case 'team_removed':
        return <UserMinus className="w-4 h-4" />;
      case 'new_member':
        return <Users className="w-4 h-4" />;
      case 'match_result':
        return <Trophy className="w-4 h-4" />;
      case 'message':
        return <MessageSquare className="w-4 h-4" />;
      case 'promotion':
        return <Crown className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'team_joined':
        return 'bg-green-100 text-green-600';
      case 'team_removed':
        return 'bg-red-100 text-red-600';
      case 'new_member':
        return 'bg-blue-100 text-blue-600';
      case 'match_result':
        return 'bg-yellow-100 text-yellow-600';
      case 'message':
        return 'bg-purple-100 text-purple-600';
      case 'promotion':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Carregando notificações...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notificações</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="rounded-full">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Nenhuma notificação</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start space-x-3 p-4 rounded-lg border ${
                  notification.is_read ? 'bg-gray-50' : 'bg-white border-blue-200'
                }`}
              >
                <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{notification.title}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </span>
                      {!notification.is_read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
                  {!notification.is_read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
