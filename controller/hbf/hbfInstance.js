

// Creates an HBF local instance
function createHBFInstance(numLevels, levelSize) {
    const levels = [];
    for (let level = 0; level < numLevels; level++) {
      // Create an array of zeros with length equal to levelSize.
      levels.push(new Array(levelSize).fill(0));
    }
    return {
      levels,
      personCount: 0,
      identities: [],
      numLevels,
      levelSize,
    };
  }
  
  // Generates a mock identity and adds it to the local HBF
  function generateIdentity(instance, indexesPerPerson = 3) {
    const identity = [];
    for (let level = 0; level < instance.numLevels; level++) {
      const indices = [];
      while (indices.length < indexesPerPerson) {
        const rand = Math.floor(Math.random() * instance.levelSize);
        if (!indices.includes(rand)) {
          indices.push(rand);
        }
      }
      identity.push(indices);
    }
    // Save the generated identity in the instance.
    instance.identities.push(identity);
    return identity;
  }
  
  // Enrolls an identity into a local HBF
  function enrollPerson(instance, person) {
    if (person.length !== instance.numLevels) {
      throw new Error("Invalid person: incorrect number of levels");
    }
    
    // For each level, increment the value at each provided index.
    for (let level = 0; level < person.length; level++) {
      const indices = person[level];
      for (let i = 0; i < indices.length; i++) {
        const idx = indices[i];
        if (idx >= instance.levelSize) {
          throw new Error("Value index out of range");
        }
        // Increment the value at the given index.
        instance.levels[level][idx] += 1;
      }
    }
    
    instance.personCount++;
    return instance;
  }
  
  module.exports = {
    createHBFInstance,
    enrollPerson,
    generateIdentity,
  };
  