import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { afterLoginGuard } from './after-login.guard';

describe('afterLoginGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => afterLoginGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
