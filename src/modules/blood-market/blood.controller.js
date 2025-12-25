import * as service from './blood.service.js';
import { findMatches } from './blood.match.service.js';



// 🌍 Public list with filters
export async function list(req, res, next) {
  try {
    const filters = {
      type: req.query.type,
      blood_type: req.query.blood_type,
      urgency: req.query.urgency,
      location: req.query.location
    };

    const data = await service.listBloodMarket(filters);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// 🌍 Public detail
export async function detail(req, res, next) {
  try {
    const isAdmin = req.user?.role === 'admin';

    const item = await service.getBloodMarketById(
      req.params.id,
      isAdmin
    );

    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}


// 👤 User creates request/offer
export async function create(req, res, next) {
  try {
    const { userId } = req.user;

    const {
      type,
      blood_type,
      quantity_ml,
      urgency,
      location,
      contact_phone,
      description,
      expires_at
    } = req.body;

    if (!type || !blood_type || !quantity_ml) {
      return res.status(400).json({
        message: 'type, blood_type, quantity_ml are required'
      });
    }

    const item = await service.createBloodMarket({
      user_id: userId,
      type,
      blood_type,
      quantity_ml,
      urgency,
      location,
      contact_phone,
      description,
      expires_at
    });

    // 🔍 AUTO MATCH
    const matches = await findMatches({
      type,
      blood_type,
      excludeId: item.id
    });

    res.status(201).json({
      success: true,
      data: item,
      matches // 👈 suggested matches
    });
  } catch (err) {
    next(err);
  }
}

// 👤 User closes OWN post
export async function closeOwn(req, res, next) {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const item = await service.closeBloodMarket(id, userId);
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

// 🔒 Admin deletes
export async function remove(req, res, next) {
  try {
    await service.deleteBloodMarket(req.params.id);
    res.json({ success: true, message: 'Blood market entry deleted' });
  } catch (err) {
    next(err);
  }
}
