import protobuf from 'protobufjs';

class ProtobufService {
  constructor() {
    this.isInitialized = false;
    this.UserList = null;
    this.initializeProto();
  }

  async initializeProto() {
    if (this.isInitialized) return;
    
    try {
      // Define the protobuf schema directly in code
      const root = protobuf.Root.fromJSON({
        nested: {
          User: {
            fields: {
              id: { type: 'string', id: 1 },
              email: { type: 'string', id: 2 },
              role: { type: 'string', id: 3 },
              status: { type: 'string', id: 4 },
              created_at: { type: 'string', id: 5 },
              email_hash: { type: 'string', id: 6 },
              signature: { type: 'string', id: 7 }
            }
          },
          UserList: {
            fields: {
              users: { rule: 'repeated', type: 'User', id: 1 }
            }
          }
        }
      });
      
      this.UserList = root.lookupType('UserList');
      this.isInitialized = true;
      console.log('Protobuf initialized successfully');
    } catch (error) {
      console.error('Failed to initialize protobuf:', error);
      // Fallback to JSON parsing if protobuf fails
      this.UserList = {
        decode: (buffer) => {
          try {
            const text = new TextDecoder().decode(buffer);
            return JSON.parse(text);
          } catch (e) {
            console.error('Fallback decode failed:', e);
            return { users: [] };
          }
        }
      };
      this.isInitialized = true;
    }
  }

  decodeUserList(buffer) {
    if (!this.isInitialized) {
      throw new Error('Protobuf not initialized');
    }
    
    try {
      const message = this.UserList.decode(new Uint8Array(buffer));
      const userList = this.UserList.toObject(message);
      console.log('Decoded users:', userList.users?.length || 0);
      return userList;
    } catch (error) {
      console.error('Failed to decode protobuf, trying fallback:', error);
      // Fallback to JSON parsing
      try {
        const text = new TextDecoder().decode(buffer);
        return JSON.parse(text);
      } catch (e) {
        console.error('Fallback also failed:', e);
        throw new Error('Failed to decode response: ' + e.message);
      }
    }
  }
}

// Create and export a singleton instance
const protobufService = new ProtobufService();
export default protobufService;