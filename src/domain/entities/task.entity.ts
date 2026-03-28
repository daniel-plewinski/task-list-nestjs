export class Task {
  constructor(
    private readonly _id: number,
    private _description: string,
  ) {}

  get id(): number {
    return this._id;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }
}
