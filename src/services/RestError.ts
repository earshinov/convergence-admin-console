/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
 */

export class RestError extends Error {
  constructor(message: string, public code: string, public details: {[key: string]: any}) {
    super(message);

    this.name = 'RestError';

    if (this.details === undefined) {
      this.details = {};
    }

    Object.setPrototypeOf(this, RestError.prototype);
  }
}