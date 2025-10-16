const db = require('../models/database');
const cryptoUtils = require('../utils/crypto');
const { v4: uuidv4 } = require('uuid');

class UserController {
  // Create user
  async createUser(req, res) {
    console.log('=== CREATE USER REQUEST ===');
    console.log('Request body:', req.body);
    
    try {
      const { email, role = 'user', status = 'active' } = req.body;
      
      if (!email) {
        console.log('Email is required');
        return res.status(400).json({ error: 'Email is required' });
      }

      console.log('Step 1: Hashing email...');
      // Hash email and create signature
      const emailHash = cryptoUtils.hashEmail(email);
      console.log('Email hash created:', emailHash.substring(0, 20) + '...');

      console.log('Step 2: Creating signature...');
      const signature = cryptoUtils.signHash(emailHash);
      console.log('Signature created:', signature.substring(0, 20) + '...');

      const user = {
        id: uuidv4(),
        email: email,
        role: role,
        status: status,
        email_hash: emailHash,
        signature: signature
      };

      console.log('Step 3: User object created:', { 
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status
      });

      console.log('Step 4: Inserting into database...');
      
      db.run(
        `INSERT INTO users (id, email, role, status, email_hash, signature) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [user.id, user.email, user.role, user.status, user.email_hash, user.signature],
        function(err) {
          if (err) {
            console.error('DATABASE ERROR:', err);
            console.error('Error message:', err.message);
            console.error('Error code:', err.code);
            
            if (err.message.includes('UNIQUE constraint failed')) {
              return res.status(400).json({ error: 'Email already exists' });
            }
            return res.status(500).json({ 
              error: 'Database error: ' + err.message 
            });
          }

          console.log('Step 5: User created successfully!');
          console.log('User ID:', user.id);
          console.log('Database changes:', this.changes);

          res.status(201).json({
            id: user.id,
            email: user.email,
            role: user.role,
            status: user.status,
            created_at: new Date().toISOString()
          });
        }
      );
    } catch (error) {
      console.error('UNEXPECTED ERROR:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ 
        error: 'Internal server error: ' + error.message 
      });
    }
  }

  // Get all users
  getUsers(req, res) {
    console.log('=== GET USERS REQUEST ===');
    db.all(`SELECT id, email, role, status, created_at FROM users ORDER BY created_at DESC`, 
    (err, rows) => {
      if (err) {
        console.error('Get users error:', err);
        return res.status(500).json({ error: 'Failed to fetch users' });
      }
      console.log(`Returning ${rows.length} users`);
      res.json(rows);
    });
  }

  // Update user
  updateUser(req, res) {
    const { id } = req.params;
    const { email, role, status } = req.body;

    let updates = [];
    let params = [];

    if (email) {
      updates.push('email = ?');
      params.push(email);
    }
    if (role) {
      updates.push('role = ?');
      params.push(role);
    }
    if (status) {
      updates.push('status = ?');
      params.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(id);

    db.run(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      params,
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to update user' });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User updated successfully' });
      }
    );
  }

  // Delete user
  deleteUser(req, res) {
    const { id } = req.params;

    db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete user' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    });
  }

  
// Export users in Protobuf format
async exportUsers(req, res) {
  try {
    console.log('=== PROTOBUF EXPORT REQUEST ===');
    
    const userProto = require('../proto/user_pb');
    
    db.all(`SELECT * FROM users`, (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch users' });
      }

      console.log(`Exporting ${rows.length} users`);

      const users = rows.map(row => ({
        id: row.id,
        email: row.email,
        role: row.role,
        status: row.status,
        created_at: row.created_at,
        email_hash: row.email_hash,
        signature: row.signature
      }));

      const userList = { users };
      console.log('User list prepared for encoding');

      const buffer = userProto.UserList.encode(userList);
      console.log('Buffer encoded, length:', buffer.length);

      res.setHeader('Content-Type', 'application/x-protobuf');
      res.setHeader('Content-Disposition', 'attachment; filename=users.pb');
      res.send(buffer);
      
      console.log('Protobuf export completed successfully');
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export users: ' + error.message });
  }
}

  // Get user statistics for graph
  getUserStats(req, res) {
    const query = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM users 
      WHERE created_at >= date('now', '-7 days')
      GROUP BY DATE(created_at)
      ORDER BY date
    `;

    db.all(query, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch user statistics' });
      }
      res.json(rows);
    });
  }
}

module.exports = new UserController();