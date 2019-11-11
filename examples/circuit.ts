import { circuit } from '../lib';

class Service {

  private executionIndex = 0;

  @circuit(2, 1000)
  public async get() {
    if (this.executionIndex < 3) {
      this.executionIndex += 1;
      throw new Error('Something went worng');
    }

    return 42;
  }

}

async function main() {
  const service = new Service();

  try {
    console.log(await service.get());
  } catch (error) {
    console.log(error); // function throws error
  }
  try {
    console.log(await service.get());
  } catch (error) {
    console.log(error); // function throws error
  }
  try {
    console.log(await service.get());
  } catch (error) {
    console.log(error); // function throws error
  }
  try {
    console.log(await service.get());
  } catch (error) {
    console.log(error); // decorator throws error
  }

  await new Promise(resolve => setTimeout(
    () => resolve(),
    1000,
  ));
  console.log(await service.get()); // prints: 42
}

main();
