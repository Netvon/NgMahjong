export class User {
	_id: string
	name: string

	constructor(_id: string, name: string) {
		this._id = _id
		this.name = name
	}

	fromJson(json: { _id: string, name: string}) {
		this._id = json._id
		this.name = json.name
	}
}
