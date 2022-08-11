export class YorozuAccount {
  name: string;

  constructor() {
    this.name = "Yorozu PAY";
  }

  setName(name: string) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  update() {
    console.log("update: name = ", this.name);
  }
}

export const withdraw = (amount: number) => {
  console.log("withdraw: amount = ", amount);
};

export const getBalance = (): number => {
  console.log("getBalance");
  return 1.234;
};
