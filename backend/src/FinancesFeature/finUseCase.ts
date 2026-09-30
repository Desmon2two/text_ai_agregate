import finService from "./finService";

async function estimateCost(){
    const result = finService.estimateCost();
    return result;

}

export default {
    estimateCost,
}