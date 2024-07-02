const SOCIAL_CATEGORY_SEEDS = [{
	nameId: 'programming',
	name: 'Programming',
}, {
	nameId: "design",
	name: "Design"
}, {
	nameId: "business",
	name: "Business and entrepneurship",
}, {
	nameId: "modelling",
	name: "Modelling and style",
}, {
	nameId: "health",
	name: "Health and exercise",
}, {
	nameId: "photography",
	name: "Photography and travel",
}, {
	nameId: "food",
	name: "Food and drinks",
}, {
	nameId: "architecture",
	name: "Design and architecture",
}, {
	nameId: "coffee",
	name: "Coffee",
}, {
	nameId: "movies",
	name: "Movies and theater",
}, {
	nameId: "books",
	name: "Books"
}, {
	nameId: "learning",
	name: "Learning"
}];

exports.SOCIAL_CATEGORY_SEEDS = SOCIAL_CATEGORY_SEEDS;

/**
 * Seed social category data
 */
async function seedSocialCategory(models) {
	const SocialCategory = models.SocialCategory;
	
	await SocialCategory.bulkCreate(SOCIAL_CATEGORY_SEEDS);
}

module.exports = seedSocialCategory;
