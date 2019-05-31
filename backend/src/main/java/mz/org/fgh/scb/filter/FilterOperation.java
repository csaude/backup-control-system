package mz.org.fgh.scb.filter;

/**
 * @author Damasceno Lopes <damascenolopess@gmail.com>
 *
 */
public enum FilterOperation {

	EQUAL {
		@Override
		public String toString() {
			return ":eq:";
		}
	},
	NOT_EQUAL {
		@Override
		public String toString() {
			return ":neq:";
		}
	},
	GREATER_THAN {
		@Override
		public String toString() {
			return ":gt:";
		}
	},
	GREATER_THAN_OR_EQUAL_TO {
		@Override
		public String toString() {
			return ":gte:";
		}
	},
	LESS_THAN {
		@Override
		public String toString() {
			return ":lt:";
		}
	},
	LESS_THAN_OR_EQUAL_TO {
		@Override
		public String toString() {
			return ":lte:";
		}
	},
	IN {
		@Override
		public String toString() {
			return ":in:";
		}
	},
	NOT_IN {
		@Override
		public String toString() {
			return ":nin:";
		}
	},
	BETWEEN {
		@Override
		public String toString() {
			return ":btn:";
		}
	},
	CONTAINS {
		@Override
		public String toString() {
			return ":like:";
		}
	}

}
