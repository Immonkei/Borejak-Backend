import * as service from './users.service.js';

// GET /api/users
export async function list(req, res, next) {
  try {
    const users = await service.listUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
}

// PUT /api/users/:id/role
export async function updateRole(req, res, next) {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await service.updateUserRole(req.params.id, role);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/users/:id  (soft delete)
export async function deactivate(req, res, next) {
  try {
    const user = await service.deactivateUser(req.params.id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}
