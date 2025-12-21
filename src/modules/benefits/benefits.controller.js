import * as service from './benefits.service.js';

export async function myBenefits(req, res, next) {
  try {
    const { userId } = req.user;

    const data = await service.getUserBenefits(userId);

    res.json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
}
