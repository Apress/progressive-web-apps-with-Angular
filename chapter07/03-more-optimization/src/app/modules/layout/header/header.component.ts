import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../core/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent {
  public user$ = this.auth.user$;
  constructor(private auth: AuthService) {}
}
