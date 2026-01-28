const router = require('express').Router();
const teamMemberController = require('../controllers/teamMember.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, teamMemberController.createTeamMember);
router.get('/', authMiddleware, teamMemberController.getAllTeamMembers);
router.get('/team/:team_id', authMiddleware, teamMemberController.getTeamMemberByTeam);
router.get('/:id', authMiddleware, teamMemberController.getTeamMemberById);
router.put('/:id', authMiddleware, teamMemberController.updateTeamMember);
router.delete('/:id', authMiddleware, teamMemberController.deleteTeamMember);

module.exports = router;
