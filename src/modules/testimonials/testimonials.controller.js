import * as service from './testimonials.service.js';


// 👤 User submits testimonial
export async function create(req, res, next) {
  try {
    const { userId } = req.user;
    const { content, rating } = req.body;

   if (!content || typeof rating !== 'number' || rating < 1 || rating > 5) {
  return res.status(400).json({
    message: 'content is required and rating must be between 1 and 5'
  });
}
    const testimonial = await service.createTestimonial(userId, { content, rating });

    res.status(201).json({ success: true, data: testimonial });
  } catch (err) {
    next(err);
  }
}

// 🌍 Public: approved testimonials
export async function listPublic(req, res, next) {
  try {
    const testimonials = await service.listApprovedTestimonials();
    res.json({ success: true, data: testimonials });
  } catch (err) {
    next(err);
  }
}

// 🔒 Admin: all testimonials
export async function listAdmin(req, res, next) {
  try {
    const testimonials = await service.listAllTestimonials();
    res.json({ success: true, data: testimonials });
  } catch (err) {
    next(err);
  }
}

// 🔒 Admin: approve
export async function approve(req, res, next) {
  try {
    const testimonial = await service.approveTestimonial(req.params.id);
    res.json({ success: true, data: testimonial });
  } catch (err) {
    next(err);
  }
}

// 🔒 Admin: delete
export async function remove(req, res, next) {
  try {
    await service.deleteTestimonial(req.params.id);
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (err) {
    next(err);
  }
}
