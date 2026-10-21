import finService from "./finService.js";

async function estimateCost(){
    const result = finService.estimateCost();
    return result;

}

export default {
    estimateCost,
}