import React, { useState, useEffect } from "react";
import {
  Mail,
  User,
  Calendar,
  Reply,
  Send,
  AlertCircle,
  CheckCircle,
  Trash2,
} from "lucide-react";
import { useUtils } from "../context";
import Toast from "../components/common/Toast";

const MessagesPage = () => {
  const { toast, showToast, formatDate, handleAsyncOperation, apiRequest } = useUtils();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState({});
  const [replyLoading, setReplyLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/contact');
      const formattedMessages = data.contacts.map(contact => {
        return {
          id: contact.$id,
          email: contact.email,
          phone: contact.phone,
          subject: 'Contact Form Submission',
          message: contact.message,
          date: contact.$createdAt,
          priority: 'normal',
          isRead: contact.read || false
        };
      });
      setMessages(formattedMessages);
    } catch (err) {
      showToast('Failed to fetch messages', 'error');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (msgId, email) => {
    if (!replyText.trim()) {
      showToast("Reply cannot be empty.", "error");
      return;
    }

    try {
      setReplyLoading(true);
      showToast("Sending...", "info");
      
      // Show sending for 3 seconds
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Send email reply
      const originalMessage = messages.find(m => m.id === msgId)?.message;
      await apiRequest('/contact/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          message: replyText,
          originalMessage: originalMessage
        })
      });
      
      showToast("Deleting message...", "info");
      
      // Show deleting message for 3 seconds
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Delete message after successful email send
      await apiRequest(`/contact/${msgId}`, { method: 'DELETE' });
      
      // Remove from list after successful operations
      setMessages((prev) => prev.filter((msg) => msg.id !== msgId));
      setReplyingTo(null);
      setReplyText("");
      
      showToast(`Reply sent to ${email} and message deleted`, "success");
    } catch (error) {
      console.error('Error sending reply:', error);
      showToast("Failed to send reply. Message not deleted.", "error");
    } finally {
      setReplyLoading(false);
    }
  };

  const handleMarkAsRead = async (msgId) => {
    setActionLoading(prev => ({ ...prev, [`read-${msgId}`]: true }));
    await handleAsyncOperation(
      async () => {
        await apiRequest(`/contact/${msgId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ read: true })
        });
        setMessages((prev) =>
          prev.map((msg) => (msg.id === msgId ? { ...msg, isRead: true } : msg))
        );
      },
      () => setActionLoading(prev => ({ ...prev, [`read-${msgId}`]: false })),
      'Message marked as read'
    );
  };

  const handleDelete = async (msgId) => {
    setActionLoading(prev => ({ ...prev, [`delete-${msgId}`]: true }));
    try {
      showToast("Deleting message...", "info");
      
      // Show loading animation for 3 seconds
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      await apiRequest(`/contact/${msgId}`, { method: 'DELETE' });
      setMessages((prev) => prev.filter((msg) => msg.id !== msgId));
      setDeleteConfirm(null);
      showToast("Message deleted successfully", "success");
    } catch (error) {
      showToast("Failed to delete message", "error");
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete-${msgId}`]: false }));
    }
  };

  const filteredMessages = messages.filter((msg) => {
    if (filter === "unread") return !msg.isRead;
    if (filter === "read") return msg.isRead;
    return true;
  });

  const unreadCount = messages.filter((msg) => !msg.isRead).length;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6 h-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Visitor Messages</h2>
        </div>
        <div className="flex flex-col items-center gap-4 mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Visitor Messages</h2>
        <div className="flex items-center gap-4 text-sm">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
            {messages.length} Total
          </div>
          {unreadCount > 0 && (
            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium">
              {unreadCount} Unread
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {["all", "unread", "read"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === type
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {type === "all" && "All Messages"}
            {type === "unread" && `Unread (${unreadCount})`}
            {type === "read" && `Read (${messages.filter(m => m.isRead).length})`}
          </button>
        ))}
      </div>

      {/* Message List */}
      <div className="overflow-y-auto max-h-[650px] flex-1 space-y-3 pr-2" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
        {filteredMessages.length === 0 ? (
          <div className="text-center py-16">
            <Mail className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No messages found
            </h3>
            <p className="text-gray-500">
              {filter === "all"
                ? "No messages at the moment."
                : `No ${filter} messages found.`}
            </p>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-gray-50 p-4 rounded-lg border hover:shadow-sm transition ${
                !msg.isRead ? "border-l-4 border-blue-500" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <User className="text-white" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-600"><strong>Email:</strong> {msg.email}</p>
                    {msg.phone && <p className="text-sm text-gray-600"><strong>Phone:</strong> {msg.phone}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    {formatDate(msg.date)}
                  </div>
                  {!msg.isRead && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium mt-1 inline-block">
                      Unread
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-3 text-left">
                <p className="text-sm text-gray-600 mb-2"><strong>Message:</strong></p>
                <p className="text-gray-700 leading-relaxed text-sm">{msg.message}</p>
              </div>

              {replyingTo === msg.id ? (
                <div className="bg-white rounded-lg p-3 space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Reply to {msg.email}
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Type your reply here..."
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        handleSendReply(msg.id, msg.email);
                      }
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition text-sm"
                      onClick={() => handleSendReply(msg.id, msg.email)}
                      disabled={replyLoading}
                    >
                      {replyLoading ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send size={14} />
                      )}
                      {replyLoading ? "Processing..." : "Send Reply"}
                    </button>
                    <button
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setReplyingTo(msg.id);
                        setReplyText("");
                        handleMarkAsRead(msg.id);
                      }}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                      <Reply size={14} />
                      Reply
                    </button>
                    {!msg.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(msg.id)}
                        disabled={actionLoading[`read-${msg.id}`]}
                        className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:bg-gray-200 disabled:text-gray-500 transition text-sm"
                      >
                        {actionLoading[`read-${msg.id}`] ? (
                          <div className="animate-spin h-3 w-3 border border-green-600 border-t-transparent rounded-full" />
                        ) : (
                          <CheckCircle size={14} />
                        )}
                        {actionLoading[`read-${msg.id}`] ? 'Reading...' : 'Mark as Read'}
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => setDeleteConfirm(msg.id)}
                    className="flex items-center gap-1 px-2 py-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition text-sm"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => {}} />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this message? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={actionLoading[`delete-${deleteConfirm}`]}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition text-sm font-medium flex items-center justify-center gap-2"
              >
                {actionLoading[`delete-${deleteConfirm}`] ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;