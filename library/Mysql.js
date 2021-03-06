class Mysql {
    /**
     *
     * @param db
     * @param table
     * @param fields
     */
    constructor(db, table, fields) {
        this.db = db;
        this.table = table;
        this.fields = fields.join(',');
    }

    /**
     *
     * @param data
     * @param next
     * @returns {Promise<void>}
     */
    create(data = {}, next) {
        this.db.query(`INSERT INTO ${this.table} SET ?`, data, next);
    }

    /**
     *
     * @param where
     * @param limits ex: [10] => LIMIT 10 - [0,10] => LIMIT 0,10 (0 = offset, 10 = limit)
     * @param next
     * @returns {Promise<void>}
     */
    read(wheres = {}, limits = [],next) {
        let limit = this.buildLimits(limits);
        let where = this.buildWhere(wheres);
        this.db.query(`SELECT ${this.fields} FROM ${this.table} ${where} ${limit}`, where, next);
    }

    /**
     *
     * @param where
     * @param data
     * @param next
     * @returns {Promise<void>}
     */
    update(wheres = {}, data = {}, next) {
        let where = this.buildWhere(wheres);
        this.db.query(`UPDATE ${this.table} SET ? ${where} ?`, [data, where], next);
    }

    /**
     *
     * @param where
     * @param data
     * @param next
     * @returns {Promise<void>}
     */
    delete(wheres = {}, data = {}, next) {
        let where = this.buildWhere(wheres);
        this.db.query(`DELETE FROM ${this.table} ${where} ?`, where, next);
    }

    /**
     * TODO: improve this method
     * @param where
     * @returns {string}
     */
    buildWhere = where => {
        let WHERE = '';
        if (where.length > 0) {
            WHERE += 'WHERE ?';
            //where.forEach(elem => {});
        }
        return WHERE;
    }

    /**
     * TODO: uselss, build a string from utils/controllers/buildLimit 1 | '0,1'
     * @param limits ex: [10] => LIMIT 10 - [0,10] => LIMIT 0,10 (0 = offset, 10 = limit)
     * @returns {string}
     */
    buildLimits = (limits = []) => {
        let limit = '';
        if (limits.length > 0) {
            if (limits.length > 1) {
                limits = limits[0].split(',');
            }
            limit = 'LIMIT ' + parseInt(limits[0]);
            if (limits[1] !== undefined) {
                limit += ',' + parseInt(limits[1]);
            }
        }
        return limit;
    }
}

module.exports = Mysql;
