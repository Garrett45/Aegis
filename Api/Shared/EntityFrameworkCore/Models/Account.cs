using System;
using System.Collections.Generic;

namespace Api.Shared.EntityFrameworkCore.Models;

public partial class Account
{
    public int Id { get; set; }

    public string IdentityProviderId { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    public virtual ICollection<InitiativeList> InitiativeLists { get; set; } = new List<InitiativeList>();
}
