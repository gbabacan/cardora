-- Add foreign key constraint for card_background_id in boards table
-- This allows card format types to have a separate background for the card theme (lottie animations)
-- while background_id is used for page background (patterns/solid colors)

ALTER TABLE boards DROP CONSTRAINT IF EXISTS boards_card_background_id_fkey;

ALTER TABLE boards
ADD CONSTRAINT boards_card_background_id_fkey
FOREIGN KEY (card_background_id) REFERENCES backgrounds(id) ON DELETE SET NULL;