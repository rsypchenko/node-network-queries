export class SocialNetworkQueries {
  constructor({ fetchCurrentUser }) {
    this.user = null;
    this.fetchCurrentUser = fetchCurrentUser;
  }

  getListOfLikedBooks(user, minimalScore = 0) {
    const books = [];
    const map = {};
    const { likes = [], friends = [] } = user;
    const excluded = likes.books ?? [];

    for (let i = 0; i < friends.length; i++) {
      let books = friends[i]?.likes?.books?.filter(name => !excluded.includes(name));

      for (let i = 0; i < books.length; i++) {
        let book = books[i];
        map[book] = map[book] ? map[book] + 1 : 1;
      }
    }

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

    return books;
  }

  findPotentialLikes({ minimalScore } = {}) {
    return new Promise((resolve) => {
      this.fetchCurrentUser()
        .then((user) => {
          const books = this.getListOfLikedBooks(user, minimalScore);
          resolve({ books });
        })
        .catch(() => {
          resolve({ books: [] });
        });
    });
  }
}
