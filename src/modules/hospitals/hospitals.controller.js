import * as service from './hospitals.service.js';

export async function create(req, res, next) {
  try {
    const hospital = await service.createHospital(req.body);
    res.status(201).json({ success: true, data: hospital });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const hospital = await service.updateHospital(req.params.id, req.body);
    res.json({ success: true, data: hospital });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await service.deleteHospital(req.params.id);
    res.json({ success: true, message: 'Hospital deleted' });
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const isAdmin = req.user?.role === 'admin';
    const hospitals = await service.getHospitals(isAdmin);
    res.json({ success: true, data: hospitals });
  } catch (err) {
    next(err);
  }
}

export async function detail(req, res, next) {
  try {
    const hospital = await service.getHospitalById(req.params.id);
    res.json({ success: true, data: hospital });
  } catch (err) {
    next(err);
  }
}
