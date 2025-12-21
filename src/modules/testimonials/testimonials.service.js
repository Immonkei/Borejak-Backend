import { supabase } from '../../config/supabase.js';

// User creates testimonial
export async function createTestimonial(userId, payload) {
  const { data, error } = await supabase
    .from('testimonials')
    .insert({
      user_id: userId,
      content: payload.content,
      rating: payload.rating,
      is_approved: false
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Public: approved testimonials only
export async function listApprovedTestimonials() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*, users(full_name, avatar_url)')
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Admin: list all testimonials
export async function listAllTestimonials() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*, users(full_name, email)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Admin: approve testimonial
export async function approveTestimonial(id) {
  const { data, error } = await supabase
    .from('testimonials')
    .update({ is_approved: true })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Admin: delete testimonial
export async function deleteTestimonial(id) {
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
