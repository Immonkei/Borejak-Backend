import * as service from './tips.service.js';

// 🔒 Admin — create
export async function create(req, res, next) {
  try {
    const tip = await service.createTip(req.body);
    res.status(201).json({ success: true, data: tip });
  } catch (err) {
    next(err);
  }
}

// 🔒 Admin — update
export async function update(req, res, next) {
  try {
    const tip = await service.updateTip(req.params.id, req.body);
    res.json({ success: true, data: tip });
  } catch (err) {
    next(err);
  }
}

// 🔒 Admin — delete
export async function remove(req, res, next) {
  try {
    await service.deleteTip(req.params.id);
    res.json({ success: true, message: 'Tip deleted' });
  } catch (err) {
    next(err);
  }
}

// 🌍 Public
export async function listPublic(req, res, next) {
  try {
    const tips = await service.listPublishedTips();
    res.json({ success: true, data: tips });
  } catch (err) {
    next(err);
  }
}

// 🔒 Admin
export async function listAdmin(req, res, next) {
  try {
    const tips = await service.listAllTips();
    res.json({ success: true, data: tips });
  } catch (err) {
    next(err);
  }
}
