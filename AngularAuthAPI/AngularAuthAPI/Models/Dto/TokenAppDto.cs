﻿namespace AngularAuthAPI.Models.Dto
{
    public class TokenAppDto //TokenApiDto
    {
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
    }
}
