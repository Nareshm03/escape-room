const express = require('express');
const { Team, User } = require('../models');

const router = express.Router();

// Get all teams with member info
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find()
      .sort({ createdAt: -1 })
      .lean();

    const teamsWithCounts = teams.map(team => ({
      id: team._id,
      name: team.name,
      description: team.description || '',
      created_by: team.createdBy || null,
      created_by_name: 'Admin',
      created_at: team.createdAt,
      updated_at: team.updatedAt,
      member_count: team.members?.length || 0
    }));

    console.log('Teams query result:', teamsWithCounts.length, 'teams');
    res.json(teamsWithCounts);
  } catch (error) {
    console.error('Teams fetch error:', error);
    res.status(500).json({ error: 'Failed to get teams: ' + error.message });
  }
});

// Create team
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  try {
    const team = new Team({
      name,
      description: description || '',
      createdBy: '1' // Default user ID, should be replaced with actual user ID from auth
    });
    await team.save();
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create team: ' + error.message });
  }
});

// Update team
router.put('/:id', async (req, res) => {
  const { name, description } = req.body;
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update team: ' + error.message });
  }
});

// Delete team
router.delete('/:id', async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete team: ' + error.message });
  }
});

module.exports = router;