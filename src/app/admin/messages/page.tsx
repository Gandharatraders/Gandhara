'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Mail, Trash2, Eye, X } from 'lucide-react';

export default function AdminMessagesPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  useEffect(() => {
    const session = localStorage.getItem('admin-session');
    if (!session) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      fetchMessages();
    }
  }, [router]);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages(messages.filter(m => m.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      } else {
        alert('Failed to delete message');
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
      alert('Failed to delete message');
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' }),
      });

      if (response.ok) {
        setMessages(messages.map(m => 
          m.id === id ? { ...m, status: 'read' } : m
        ));
      } else {
        alert('Failed to update message');
      }
    } catch (error) {
      console.error('Failed to update message:', error);
      alert('Failed to update message');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-light text-[#F5F5F5] mb-2">
              Messages <span className="font-semibold text-[#C7CBD0]">Management</span>
            </h1>
            <p className="text-[#A6A6A6]">
              View and manage customer inquiries and messages.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#101010] rounded-xl p-6 border border-[#292929]">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-5 h-5 text-[#C7CBD0]" />
              <span className="text-sm text-[#A6A6A6]">Total Messages</span>
            </div>
            <p className="text-2xl font-semibold text-[#F5F5F5]">{messages.length}</p>
          </div>
          <div className="bg-[#101010] rounded-xl p-6 border border-[#292929]">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-[#A6A6A6]">Unread</span>
            </div>
            <p className="text-2xl font-semibold text-[#F5F5F5]">
              {messages.filter(m => m.status === 'unread').length}
            </p>
          </div>
          <div className="bg-[#101010] rounded-xl p-6 border border-[#292929]">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-5 h-5 text-green-500" />
              <span className="text-sm text-[#A6A6A6]">Read</span>
            </div>
            <p className="text-2xl font-semibold text-[#F5F5F5]">
              {messages.filter(m => m.status === 'read').length}
            </p>
          </div>
        </div>

        {/* Messages Table */}
        <div className="bg-[#101010] rounded-xl border border-[#292929] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#292929] bg-[#151515]">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#A6A6A6]">
                    Date
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#A6A6A6]">
                    Name
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#A6A6A6]">
                    Email
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#A6A6A6]">
                    Subject
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#A6A6A6]">
                    Status
                  </th>
                  <th className="text-right py-4 px-4 text-sm font-semibold text-[#A6A6A6]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <p className="text-[#A6A6A6]">Loading messages...</p>
                    </td>
                  </tr>
                ) : messages.length > 0 ? (
                  messages.map((message) => (
                    <tr 
                      key={message.id} 
                      className={`border-b border-[#292929] hover:bg-[#151515] ${
                        message.status === 'unread' ? 'bg-[#151515]/50' : ''
                      }`}
                    >
                      <td className="py-4 px-4 text-[#A6A6A6]">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-[#F5F5F5]">{message.name}</td>
                      <td className="py-4 px-4 text-[#A6A6A6]">{message.email}</td>
                      <td className="py-4 px-4 text-[#F5F5F5]">{message.subject}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            message.status === 'unread'
                              ? 'bg-yellow-500/10 text-yellow-500'
                              : 'bg-green-500/10 text-green-500'
                          }`}
                        >
                          {message.status === 'unread' ? 'Unread' : 'Read'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedMessage(message)}
                            className="p-2 text-[#A6A6A6] hover:text-[#F5F5F5] hover:bg-[#292929] rounded-lg transition-colors"
                            title="View message"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMarkAsRead(message.id)}
                            disabled={message.status === 'read'}
                            className="p-2 text-[#A6A6A6] hover:text-[#F5F5F5] hover:bg-[#292929] rounded-lg transition-colors disabled:opacity-50"
                            title="Mark as read"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(message.id)}
                            className="p-2 text-[#A6A6A6] hover:text-[#E50920] hover:bg-[#292929] rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <p className="text-[#A6A6A6]">No messages found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Message Detail Modal */}
        {selectedMessage && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-[#101010] rounded-xl border border-[#292929] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-[#F5F5F5]">Message Details</h3>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-2 text-[#A6A6A6] hover:text-[#F5F5F5]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[#A6A6A6] mb-1">Date</p>
                      <p className="text-[#F5F5F5]">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#A6A6A6] mb-1">Status</p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          selectedMessage.status === 'unread'
                            ? 'bg-yellow-500/10 text-yellow-500'
                            : 'bg-green-500/10 text-green-500'
                        }`}
                      >
                        {selectedMessage.status === 'unread' ? 'Unread' : 'Read'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-[#A6A6A6] mb-1">Name</p>
                    <p className="text-[#F5F5F5]">{selectedMessage.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-[#A6A6A6] mb-1">Email</p>
                    <p className="text-[#F5F5F5]">{selectedMessage.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-[#A6A6A6] mb-1">Subject</p>
                    <p className="text-[#F5F5F5]">{selectedMessage.subject}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-[#A6A6A6] mb-1">Message</p>
                    <div className="bg-[#151515] rounded-lg p-4">
                      <p className="text-[#F5F5F5] whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  {selectedMessage.status === 'unread' && (
                    <Button
                      onClick={() => {
                        handleMarkAsRead(selectedMessage.id);
                        setSelectedMessage({ ...selectedMessage, status: 'read' });
                      }}
                    >
                      Mark as Read
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleDelete(selectedMessage.id);
                      setSelectedMessage(null);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
