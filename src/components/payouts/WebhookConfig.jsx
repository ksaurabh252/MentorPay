import { useState } from 'react';
import { FiLink, FiSave, FiClock, FiCode } from 'react-icons/fi';
import { BiTestTube } from 'react-icons/bi';
import { createSignature, mockVerifySignature } from '../../utils/webhookUtils';

const WebhookConfig = ({ webhooks, setWebhooks }) => {
  const [newWebhook, setNewWebhook] = useState({
    url: '',
    name: '',
    events: ['payout_processed'],
    secret: '',
    active: true
  });

  const [testResult, setTestResult] = useState(null);
  const [mockCalls, setMockCalls] = useState([]);
  const [isTesting, setIsTesting] = useState(false);

  const handleAddWebhook = () => {
    const webhookWithId = {
      ...newWebhook,
      id: Date.now().toString()
    };
    setWebhooks([...webhooks, webhookWithId]);
    setMockCalls([...mockCalls, {
      id: webhookWithId.id,
      calls: []
    }]);
    setNewWebhook({
      url: '',
      name: '',
      events: ['payout_processed'],
      secret: '',
      active: true
    });
  };

  const testWebhook = async (url, secret = newWebhook.secret) => {
    setIsTesting(true);
    setTestResult(null);

    try {
      if (!url) throw new Error("URL is required");

      // Create mock payload
      const payload = {
        event: "payout_processed",
        timestamp: new Date().toISOString(),
        data: {
          amount: Math.floor(Math.random() * 10000) + 1000, // Random amount
          currency: "INR",
          test: true
        }
      };

      // Generate signature
      const signature = createSignature(secret, payload);

      console.log('Generated Signature:', signature);

      // Simulate network delay (800-1200ms)
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

      // Mock validation
      if (!url.startsWith('http')) {
        throw new Error("URL must start with http:// or https://");
      }

      const isValid = mockVerifySignature(signature, payload, secret);
      console.log('Signature Valid:', isValid); // Debug log

      if (!isValid) {
        throw new Error(`Signature verification failed - ${secret ? 'Invalid secret' : 'No secret provided'}`);
      }

      // Update mock call history
      setMockCalls(prev => prev.map(item =>
        item.id === webhooks.find(w => w.url === url)?.id || newWebhook.id
          ? {
            ...item,
            calls: [...item.calls, {
              timestamp: new Date(),
              payload,
              success: true
            }]
          }
          : item
      ));

      setTestResult({
        status: 'success',
        message: `Mock webhook sent successfully to ${url}`,
        payload, signature
      });
    } catch (err) {
      console.error('Webhook test failed:', err);

      setTestResult({
        status: 'error',
        message: err.message,
        timestamp: new Date()
      });

      // Log failed attempts
      setMockCalls(prev => prev.map(item =>
        item.id === webhooks.find(w => w.url === url)?.id || newWebhook.id
          ? {
            ...item,
            calls: [...item.calls, {
              timestamp: new Date(),
              error: err.message,
              success: false
            }]
          }
          : item
      ));
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <FiLink className="mr-2" />Webhook Configuration
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



        <div className="flex justify-between pt-4">
          <button
            onClick={() => testWebhook(newWebhook.url)}
            disabled={!newWebhook.url || isTesting}
            className={`flex items-center gap-2 px-4 py-2 text-white rounded ${isTesting
              ? 'bg-blue-400'
              : 'bg-blue-600 hover:bg-blue-700'
              } disabled:opacity-50`}
          >
            <BiTestTube />
            {isTesting ? 'Testing...' : 'Test Webhook'}
          </button>

          <button
            onClick={handleAddWebhook}
            disabled={!newWebhook.url}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            <FiSave />Save Webhook
          </button>
        </div>

        {/* Enhanced test result display */}
        {testResult && (
          <div className={`p-3 mt-4 rounded ${testResult.status === 'success'
            ? 'bg-green-100 dark:bg-green-900'
            : 'bg-red-100 dark:bg-red-900'
            }`}>
            <div className="flex items-start">
              {testResult.status === 'success' ? (
                <span className="text-green-800 dark:text-green-200">✓</span>
              ) : (
                <span className="text-red-800 dark:text-red-200">✗</span>
              )}
              <div className="ml-2">
                <p>{testResult.message}</p>
                {testResult.payload && (
                  <details className="mt-2 text-sm">
                    <summary className="cursor-pointer">Payload Details</summary>
                    <pre className="bg-black bg-opacity-10 p-2 rounded mt-1 overflow-x-auto">
                      {JSON.stringify(testResult.payload, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced webhook list with call history */}
      {webhooks.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-3">Active Webhooks</h3>
          <div className="space-y-4">
            {webhooks.map((hook) => {
              const hookCalls = mockCalls.find(m => m.id === hook.id)?.calls || [];
              return (
                <div key={hook.id} className="border rounded-lg overflow-hidden">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{hook.name || 'Unnamed Webhook'}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{hook.url}</p>
                    </div>
                    <button
                      onClick={() => testWebhook(hook.url, hook.secret)}
                      className="p-2 text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
                      title="Test Webhook"
                    >
                      <BiTestTube />
                    </button>
                  </div>

                  {hookCalls.length > 0 && (
                    <div className="border-t divide-y">
                      {hookCalls.slice().reverse().slice(0, 3).map((call, i) => (
                        <div
                          key={i}
                          className={`p-3 text-sm ${call.success
                            ? 'bg-green-50 dark:bg-green-900/20'
                            : 'bg-red-50 dark:bg-red-900/20'
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            <FiClock className="opacity-70" />
                            <span>{new Date(call.timestamp).toLocaleString()}</span>
                            <span className={`px-2 py-0.5 rounded text-xs ${call.success
                              ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200'
                              : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200'
                              }`}>
                              {call.success ? 'Success' : 'Failed'}
                            </span>
                          </div>
                          {call.error && (
                            <p className="mt-1 text-red-600 dark:text-red-400">{call.error}</p>
                          )}
                          {call.payload && (
                            <details className="mt-2">
                              <summary className="inline-flex items-center text-xs cursor-pointer">
                                <FiCode className="mr-1" /> View payload
                              </summary>
                              <pre className="bg-black bg-opacity-5 dark:bg-white dark:bg-opacity-5 p-2 rounded mt-1 overflow-x-auto text-xs">
                                {JSON.stringify(call.payload, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebhookConfig;