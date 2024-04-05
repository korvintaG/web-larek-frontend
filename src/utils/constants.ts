export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
    categoryClass : new Map<string, string>([
        ['софт-скил','soft'],
        ['другое','other'],
        ['дополнительное','additional'],
        ['хард-скил','hard'],
        ['кнопка','button']
    ])
};

