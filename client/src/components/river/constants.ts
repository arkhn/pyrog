export const UPDATE_FREQUENCIES: Record<string, string | null> = {
    "run once": null,
    "once a day": "0 0 * * *",
    "twice a day": "0 0/12 * * *",
    "three times a day": "0 0/8 * * *",
    "four times a day": "0 0/6 * * *",
    "six times a day": "0 0/4 * * *",
}
