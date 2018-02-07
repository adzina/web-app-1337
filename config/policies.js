/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  LessonController: {
    find: 'sessionAuth',
    create: 'sessionAuth'
  },
  GroupController: {
    getGroups: 'sessionAuth',
    create: 'sessionAuth'
  },
  LessonController: {
    getTeacherID: 'sessionAuth',
    create: 'sessionAuth',
    getLessonID: 'sessionAuth',
  },
  GroupLessonController: {
    addGroupToLesson: 'sessionAuth',
    removeGroupFromLesson: 'sessionAuth',
    getLessonsGroups: 'sessionAuth',
    getGroupsID: 'sessionAuth',
    getGroupsLessons: 'sessionAuth',
    getLessonsID: 'sessionAuth',
  },
  GroupUserController: {
    	addUserToGroup: 'sessionAuth',
    	removeUserFromGroup: 'sessionAuth',
    	getGroupsUsers: 'sessionAuth',
    	getUsersID: 'sessionAuth',
      getMyGroups: 'sessionAuth',
      getGroupsID: 'sessionAuth',
  },
  LessonWordController: {
    create: 'sessionAuth',
    getLessonsWords: 'sessionAuth',
    getWordsID: 'sessionAuth',
    removeWordFromLesson:'sessionAuth',
  },
  StudentWordController: {
    addOrUpdateStudentWord: 'sessionAuth',
  },
  UserController: {
    //create: 'sessionAuth',
    getAll: 'sessionAuth',
    findByID: 'sessionAuth',
  },
  WordController: {
    add: 'sessionAuth',
    create: 'sessionAuth',
    addToLesson: 'sessionAuth',
  }
  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/

  // '*': true,

  /***************************************************************************
  *                                                                          *
  * Here's an example of mapping some policies to run before a controller    *
  * and its actions                                                          *
  *                                                                          *
  ***************************************************************************/
	// RabbitController: {

		// Apply the `false` policy as the default for all of RabbitController's actions
		// (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
		// '*': false,

		// For the action `nurture`, apply the 'isRabbitMother' policy
		// (this overrides `false` above)
		// nurture	: 'isRabbitMother',

		// Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
		// before letting any users feed our rabbits
		// feed : ['isNiceToAnimals', 'hasRabbitFood']
	// }
};
