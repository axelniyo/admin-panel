import React, { useState } from 'react';
import { userAPI } from '../services/api';
import protobufService from '../services/protobufService';
import { CryptoUtils } from '../utils/crypto';

const ProtobufExport = () => {
  const [exportedUsers, setExportedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [verificationResults, setVerificationResults] = useState({});

  const handleExport = async () => {
  setLoading(true);
  try {
    console.log('Starting Protobuf export...');
    
    // Ensure protobuf is initialized
    await protobufService.initializeProto();
    
    const response = await userAPI.exportUsers();
    console.log('Received response, data length:', response.data.byteLength);
    
    // Decode protobuf
    const userList = protobufService.decodeUserList(response.data);
    console.log('Decoded user list:', userList);
    
    const users = userList.users || [];
    setExportedUsers(users);

    // Verify signatures
    const results = {};
    for (const user of users) {
      try {
        const hash = await CryptoUtils.hashEmail(user.email);
        const isValid = CryptoUtils.verifySignature(
          hash,
          user.signature,
          CryptoUtils.getPublicKey()
        );
        results[user.id] = isValid;
      } catch (error) {
        console.error('Error verifying user:', user.email, error);
        results[user.id] = false;
      }
    }
    setVerificationResults(results);

    alert(`Successfully exported ${users.length} users via Protobuf`);
  } catch (error) {
    console.error('Failed to export users:', error);
    alert('Failed to export users: ' + error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="protobuf-export">
      <h2>Protobuf Export</h2>
      
      <button onClick={handleExport} disabled={loading}>
        {loading ? 'Exporting...' : 'Export Users via Protobuf'}
      </button>

      {exportedUsers.length > 0 && (
        <div className="exported-users">
          <h3>Exported Users ({exportedUsers.length})</h3>
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Signature Valid</th>
                <th>Email Hash</th>
              </tr>
            </thead>
            <tbody>
              {exportedUsers.map(user => (
                <tr 
                  key={user.id} 
                  className={verificationResults[user.id] ? 'signature-valid' : 'signature-invalid'}
                >
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    {verificationResults[user.id] ? (
                      <span style={{ color: 'green' }}>✓ Valid</span>
                    ) : (
                      <span style={{ color: 'red' }}>✗ Invalid</span>
                    )}
                  </td>
                  <td title={user.email_hash}>
                    {user.email_hash.substring(0, 16)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProtobufExport;