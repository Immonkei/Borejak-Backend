import * as service from './donations.service.js';

export async function create(req, res, next) {
  try {
    const donation = await service.createDonation(
      req.user.userId,
      req.body
    );

    res.status(201).json({
      success: true,
      data: donation
    });
  } catch (err) {
    next(err);
  }
}

export async function myDonations(req, res, next) {
  try {
    const donations = await service.myDonations(req.user.userId);

    res.json({
      success: true,
      data: donations
    });
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const donations = await service.listDonations();

    res.json({
      success: true,
      data: donations
    });
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req, res, next) {
  try {
    const donation = await service.updateDonationStatus(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      data: donation
    });
  } catch (err) {
    next(err);
  }
}

export async function registerForEvent(req, res, next) {
  try {
    const donation = await service.createDonation(
      req.user.userId,
      { event_id: req.params.id }
    );

    res.status(201).json({
      success: true,
      data: donation
    });
  } catch (err) {
    next(err);
  }
}
