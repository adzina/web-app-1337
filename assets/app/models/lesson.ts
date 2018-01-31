//You can see the model for Sails into /api/models/Employee.js
export class Lesson {
	constructor(
		public createdAt: Date,
		public date: Date,
		public id: string,
		public subject:string,
		public teacherID: string,
		public updatedAt: Date){}
}
