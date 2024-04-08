class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    /// find query
    filter() {
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        const queryObject = { ...this.queryString };
        const excludeFilters = ['fields', 'sort', 'limit', 'page'];
        excludeFilters.forEach((el) => delete queryObject[el]);

        /// Advanced Filtering
        let queryStr = JSON.stringify(queryObject);
        queryStr = queryStr.replace(
            /\b(gte|lte|gt|lt)\b/g,
            (match) => `$${match}`,
        );
        console.log(queryStr, 'query: ');
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    /// sort query
    sort() {
        if (this.queryString.sort) {
            const sortQuery = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortQuery);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    /// fields limiting query
    fieldsLimiting() {
        if (this.queryString.fields) {
            console.log(this.queryString.fields);
            const fieldsQuery = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fieldsQuery);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    // paginated query
    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = APIFeatures;
