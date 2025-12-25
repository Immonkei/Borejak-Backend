import { supabase } from '../../config/supabase.js';
export async function getUserBenefits(userId) {
  const { data: donations, error } = await supabase
    .from('donations')
    .select('donation_date')
    .eq('user_id', userId)
    .eq('status', 'completed');

  if (error) throw error;

  // Remove invalid records
  const validDonations = donations.filter(
    d => d.donation_date !== null
  );

  const total = validDonations.length;

  // Last donation date
  let lastDonation = null;
  if (total > 0) {
    lastDonation = validDonations
      .map(d => new Date(d.donation_date))
      .sort((a, b) => b - a)[0];
  }

  // Cooldown logic (90 days)
  const cooldownDays = 90;
  const now = new Date();

  let eligible = true;
  let nextEligibleDate = null;

  if (lastDonation) {
    nextEligibleDate = new Date(lastDonation);
    nextEligibleDate.setDate(
      nextEligibleDate.getDate() + cooldownDays
    );
    eligible = now >= nextEligibleDate;
  }

  // Benefit level
  let level = 'new';
  if (total >= 5) level = 'gold';
  else if (total >= 3) level = 'silver';
  else if (total >= 1) level = 'bronze';

  return {
    total_donations: total,
    last_donation_date: lastDonation,
    eligible,
    next_eligible_date: nextEligibleDate,
    level
  };
}
