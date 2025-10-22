const db = require('../utils/db');

// Prevent duplicate submissions per stage
const preventDuplicateSubmission = async (req, res, next) => {
  try {
    // Get user's team
    const teamResult = await db.query(`
      SELECT t.id 
      FROM teams t
      JOIN team_members tm ON t.id = tm.team_id
      WHERE tm.user_id = $1
      LIMIT 1
    `, [req.user.id]);

    if (teamResult.rows.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const teamId = teamResult.rows[0].id;

    // Get team progress
    const progressResult = await db.query(
      'SELECT current_stage FROM team_progress WHERE team_id = $1',
      [teamId]
    );

    if (progressResult.rows.length === 0) {
      return res.status(404).json({ error: 'Game not started' });
    }

    const currentStage = progressResult.rows[0].current_stage;

    // Check for recent correct submission (within last 5 seconds)
    const recentSubmission = await db.query(`
      SELECT id FROM submission_attempts 
      WHERE team_id = $1 AND stage_number = $2 AND is_correct = true 
      AND submitted_at > NOW() - INTERVAL '5 seconds'
      LIMIT 1
    `, [teamId, currentStage]);

    if (recentSubmission.rows.length > 0) {
      return res.status(429).json({ error: 'Stage already completed recently' });
    }

    // Check submission rate (max 3 per minute per stage)
    const recentAttempts = await db.query(`
      SELECT COUNT(*) as count FROM submission_attempts 
      WHERE team_id = $1 AND stage_number = $2 
      AND submitted_at > NOW() - INTERVAL '1 minute'
    `, [teamId, currentStage]);

    if (parseInt(recentAttempts.rows[0].count) >= 3) {
      return res.status(429).json({ error: 'Too many attempts for this stage. Wait 1 minute.' });
    }

    req.teamId = teamId;
    req.currentStage = currentStage;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Prevent duplicate final code submissions
const preventDuplicateFinalSubmission = async (req, res, next) => {
  try {
    // Get user's team
    const teamResult = await db.query(`
      SELECT t.id 
      FROM teams t
      JOIN team_members tm ON t.id = tm.team_id
      WHERE tm.user_id = $1
      LIMIT 1
    `, [req.user.id]);

    if (teamResult.rows.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const teamId = teamResult.rows[0].id;

    // Check if already submitted
    const existingSubmission = await db.query(
      'SELECT final_code_submitted FROM team_progress WHERE team_id = $1',
      [teamId]
    );

    if (existingSubmission.rows.length > 0 && existingSubmission.rows[0].final_code_submitted) {
      return res.status(400).json({ error: 'Final code already submitted' });
    }

    req.teamId = teamId;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  preventDuplicateSubmission,
  preventDuplicateFinalSubmission
};