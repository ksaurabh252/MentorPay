import { useState } from 'react';
import { FiLink, FiSave } from 'react-icons/fi';

import { BiTestTube } from 'react-icons/bi';
const WebhookConfig = ({ webhooks, setWebhooks }) => {
  const [newWebhook, setNewWebhook] = useState({
    url: '',
    name: '',
    events: ['payout_processed'],
    secret: '',
    active: true
  });

  const [testResult, setTestResult] = useState(null);

  const handleAddWebhook = () => {
    setWebhooks([...webhooks, newWebhook]);
    setNewWebhook({
      url: '',
      name: '',
      events: ['payout_processed'],
      secret: '',
      active: true
    });
  };

  const testWebhook = async (url) => {
    try {
      const response = await fetch('/api/webhooks/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) throw new Error('Webhook failed');
      setTestResult(`Success: ${response.statusText}`);
    } catch (err) {
      setTestResult(`Error: ${err.message}`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <FiLink className="mr-2" /> Webhook Configuration
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Webhook URL
          </label>
          <input
            type="url"
            value={newWebhook.url}
            onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
            placeholder="https://api.your-service.com/webhook"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={newWebhook.name}
              onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
              placeholder="Production Server"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Secret Key
            </label>
            <input
              type="password"
              value={newWebhook.secret}
              onChange={(e) => setNewWebhook({ ...newWebhook, secret: e.target.value })}
              placeholder="••••••••"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Trigger Events
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newWebhook.events.includes('payout_processed')}
                onChange={(e) => {
                  const events = e.target.checked
                    ? [...newWebhook.events, 'payout_processed']
                    : newWebhook.events.filter(evt => evt !== 'payout_processed');
                  setNewWebhook({ ...newWebhook, events });
                }}
                className="mr-2"
              />
              Payout Processed
            </label>
            {/* Add more event types as needed */}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={() => testWebhook(newWebhook.url)}
            disabled={!newWebhook.url}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            <BiTestTube /> Test Webhook
          </button>

          <button
            onClick={handleAddWebhook}
            disabled={!newWebhook.url}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            <FiSave /> Save Webhook
          </button>
        </div>

        {testResult && (
          <div className="p-3 mt-4 rounded bg-gray-100 dark:bg-gray-700">
            {testResult}
          </div>
        )}
      </div>

      {/* List of configured webhooks */}
      {webhooks.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-3">Active Webhooks</h3>
          <div className="space-y-3">
            {webhooks.map((hook, index) => (
              <div key={index} className="p-3 border rounded flex justify-between items-center">
                <div>
                  <p className="font-medium">{hook.name || 'Unnamed Webhook'}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{hook.url}</p>
                </div>
                <button
                  onClick={() => testWebhook(hook.url)}
                  className="p-2 text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
                >
                  <BiTestTube />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebhookConfig;