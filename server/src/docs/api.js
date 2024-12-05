/**
 * @api {post} /api/interactions/update Handle Meme Interaction
 * @apiName HandleInteraction
 * @apiGroup Interactions
 *
 * @apiParam {String} action Action type: "like", "dislike", or "superlike"
 * @apiParam {Number} memeId ID of the meme
 * @apiParam {String} telegramId Telegram user ID
 * 
 * @apiSuccess {Boolean} success Operation status
 * @apiSuccess {Object} data Response data
 * @apiSuccess {Object} data.meme Updated meme data
 * @apiSuccess {Object} data.user Updated user data
 * 
 * @apiError {Boolean} success false
 * @apiError {String} error Error message
 */

/**
 * @api {get} /api/leaderboard Get Leaderboard
 * @apiName GetLeaderboard
 * @apiGroup Leaderboard
 *
 * @apiParam {String} [type=all] Leaderboard type: "all", "users", or "projects"
 * @apiParam {Number} [limit=50] Number of results to return
 * 
 * @apiSuccess {Boolean} success Operation status
 * @apiSuccess {Object} data Response data
 * @apiSuccess {Array} data.users Top users list
 * @apiSuccess {Array} data.projects Top projects list
 */

// Additional documentation for other endpoints...