using System;
using System.Collections.Generic;

namespace Api.Shared.EntityFrameworkCore.Models;

public partial class InitiativeList
{
    public int Id { get; set; }

    public int AccountId { get; set; }

    public string Name { get; set; } = null!;

    public int Round { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual ICollection<InitiativeListItem> InitiativeListItems { get; set; } = new List<InitiativeListItem>();
}
