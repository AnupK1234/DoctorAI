const BASE_COST_PER_NODE = 963;

const calculateCost = (numNodes) => {
  return numNodes * BASE_COST_PER_NODE;
};

module.exports = { calculateCost };
