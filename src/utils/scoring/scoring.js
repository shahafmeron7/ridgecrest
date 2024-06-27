import questionnaireData from "@/utils/data/questionnaireData.js";
import env from "@/utils/data/env";

function chooseRandomlyIfTied(scores, excludePaycor, brandIds) {
    const brands = excludePaycor ? [brandIds.Paychex] : Object.keys(scores);
    console.log("brands",brands)
    console.log("scores",scores)

    const maxScore = Math.max(...brands.map(id => scores[id]));
    const candidates = brands.filter(id => scores[id] === maxScore);
    // Choose randomly among the tied candidates
    console.log("chooseRandomlyIfTied candidates",candidates)
    let resultBrand = candidates[Math.floor(Math.random() * candidates.length)];
    console.log("resultBrand candidates",resultBrand)

    return  resultBrand;
}
export function calculateScores(responseData) {
    // Map environment variables to brand IDs
    const brandIds = {
        // ADP: env.ADP_FORM_ID,
        Paychex: env.PAYCHEX_FORM_ID,
        Paycor: env.PAYCOR_FORM_ID
    };

    let brandScores = {
        // [brandIds.ADP]: 0,
        [brandIds.Paychex]: 0,
        [brandIds.Paycor]: 0
    };

    // Check if "12+ Months" is selected and set flag to exclude (PAYCOR)
    const excludePaycor = responseData['purchase_time'] && responseData['purchase_time'].answer === '12+ Months';

    // Define the general scoring distribution
    const generalScoring = {
        [brandIds.Paycor]: excludePaycor ? 0 : 0.7, // No points to PAYCOR if "12+ Months" is selected
        [brandIds.Paychex]: 0.3,
        // [brandIds.ADP]: 1
    };

    // Specific scoring for "purchase_time" when it does not lead to exclusion
    const purchaseTimeScoring = {
        '0-3 Months': generalScoring,
        '3-6 Months': generalScoring,
        '6-12 Months': generalScoring,
        '12+ Months': {
            [brandIds.Paycor]: 0, // Ensure paycor gets 0 regardless
            [brandIds.Paychex]: 1, // 100% distribution between to Paychecx
            // [brandIds.ADP]: 2
        }
    };

    // Dynamically include questions based on the 'included_in_scoring' field
    const includedQuestions = questionnaireData.questions.filter(q => q.included_in_scoring).map(q => q.code);
    console.log(includedQuestions);
    // Iterate over the included questions to calculate scores
    includedQuestions.forEach(question => {
        if (question in responseData) {
            let answer = responseData[question].answer;
            let scoringRules = question === 'purchase_time' ? purchaseTimeScoring[answer] : generalScoring;

            Object.keys(scoringRules).forEach(brand => {
                brandScores[brand] += scoringRules[brand];
            });
        }
    });

    // Determine the brand with the highest score
    let maxScoreBrand = chooseRandomlyIfTied(brandScores, excludePaycor, brandIds);

    return {selectedBrand: maxScoreBrand, allScores: brandScores};
}


