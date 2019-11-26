import { TestBed, inject } from "@angular/core/testing";

import { FirebaseAuthService } from "./firebaseAuth.service";

describe("FirebaseAuthService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirebaseAuthService]
    });
  });

  it("should be created", inject(
    [FirebaseAuthService],
    (service: FirebaseAuthService) => {
      expect(service).toBeTruthy();
    }
  ));
});
