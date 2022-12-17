export class SocialNetworkQueries {

    constructor({ fetchCurrentUser }) {
        this.fetchCurrentUser = fetchCurrentUser;
    }

    async findPotentialLikes({ minimalScore } = {}) {
        const books = [];
        let user;

        try {
            user = await this.fetchCurrentUser();
        } catch (e) {
            return Promise.resolve({ books });
        }

        const { likes = [], friends = [] } = user;
        const excluded = likes.books ?? [];

        const map = friends.reduce((acc, current) => {
            let books = current?.likes?.books.filter(book => !excluded.includes(book));

            for (let i = 0; i < books.length; i++) {
                let book = books[i];
                if (acc.hasOwnProperty(book)) {
                    acc[book] = acc[book] + 1;
                } else {
                    acc[book] = 1;
                }
            }

            return acc;
        }, {});

        const keys = Object.keys(map).sort((a, b) => {
            if (map[a] > map[b]) {
                return -1;
            } else if (map[a] < map[b]) {
                return 1;
            } else {
                if (a > b) return 1;
                else if (a < b) return -1;
                else return 0;
            }
        });

        for (let key of keys) {
            let num = map[key] / friends.length;
            if (num >= minimalScore) {
                books.push(key);
            }
        }


        return Promise.resolve({ books });
    }

}
