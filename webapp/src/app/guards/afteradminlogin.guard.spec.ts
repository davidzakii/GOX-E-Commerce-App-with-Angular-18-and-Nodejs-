import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { afteradminloginGuard } from './afteradminlogin.guard';

describe('afteradminloginGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => afteradminloginGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
