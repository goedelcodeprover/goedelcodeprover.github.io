import Mathlib
set_option maxHeartbeats 0

namespace verina_advanced_1

def filterlist (x : Int) (nums : List Int) : List Int :=
  let rec aux (lst : List Int) : List Int :=
    match lst with
    | []      => []
    | y :: ys => if y = x then y :: aux ys else aux ys
  aux nums

@[reducible]
def FindSingleNumber_precond (nums : List Int) : Prop :=
  let numsCount := nums.map (fun x => nums.count x)
  numsCount.all (fun count => count = 1 ∨ count = 2) ∧ numsCount.count 1 = 1

def FindSingleNumber (nums : List Int) (h_precond : FindSingleNumber_precond (nums)) : Int :=
  let rec findUnique (remaining : List Int) : Int :=
    match remaining with
    | [] =>
      0
    | x :: xs =>
      let filtered : List Int :=
        filterlist x nums
      let count : Nat :=
        filtered.length
      if count = 1 then
        x
      else
        findUnique xs
  findUnique nums

@[reducible]
def FindSingleNumber_postcond (nums : List Int) (result: Int) (h_precond : FindSingleNumber_precond (nums)) : Prop :=
  (nums.length > 0)
  ∧
  ((filterlist result nums).length = 1)
  ∧
  (∀ (x : Int),
    x ∈ nums →
    (x = result) ∨ ((filterlist x nums).length = 2))

-- EVOLVE-BLOCK-START

lemma length_filterlist_eq_count (x : Int) (nums : List Int) :
    (filterlist x nums).length = nums.count x := by
  classical
  have aux_eq : ∀ lst : List Int, filterlist.aux x lst = lst.filter (fun y => y = x) := by
    intro lst; induction lst with
    | nil => simp [filterlist.aux]
    | cons y ys ih => by_cases h : y = x <;> simp [filterlist.aux, ih, h]
  have eq_filter : filterlist x nums = nums.filter (fun y => y = x) := by simp [filterlist, aux_eq]
  simpa [eq_filter] using (List.count_eq_length_filter (l := nums) (a := x)).symm

/-- There exists an element of `nums` that occurs exactly once. -/
lemma exists_count_eq_one
    (nums : List Int) (h_precond : FindSingleNumber_precond nums) :
    ∃ x ∈ nums, nums.count x = 1 := by
  classical
  unfold FindSingleNumber_precond at h_precond; rcases h_precond with ⟨_hall, huniq⟩
  have hmem : 1 ∈ (nums.map (fun x => nums.count x)) := by
    by_contra hnot
    have : (nums.map (fun x => nums.count x)).count 1 = 0 := by simp [List.count_eq_zero, hnot]
    exact Nat.one_ne_zero (by simpa [this] using huniq)
  rcases List.mem_map.mp hmem with ⟨x, hx, hxcount⟩
  exact ⟨x, hx, by simpa using hxcount⟩

/-- Auxiliary lemma: the recursive scanner returns a value whose `filterlist`-length is `1`,
provided some element in the list has `filterlist`-length `1`. -/
lemma findUnique_returns_length_one (nums : List Int) :
    ∀ remaining : List Int,
      (∃ u ∈ remaining, (filterlist u nums).length = 1) →
        (filterlist (FindSingleNumber.findUnique (nums := nums) remaining) nums).length = 1 := by
  classical
  intro remaining; induction remaining with
  | nil => intro hex; rcases hex with ⟨u, hu, _⟩; cases hu
  | cons x xs ih =>
      intro hex
      simp [FindSingleNumber.findUnique]
      by_cases hx1 : (filterlist x nums).length = 1
      · simp [hx1]
      · have hex' : ∃ u ∈ xs, (filterlist u nums).length = 1 := by
          rcases hex with ⟨u, hu_mem, hu_len⟩; simp at hu_mem
          cases hu_mem with
          | inl hu_eq => subst hu_eq; exact False.elim (hx1 hu_len)
          | inr hu_mem_xs => exact ⟨u, hu_mem_xs, hu_len⟩
        simpa [hx1] using ih hex'

/-- The algorithm returns a value that occurs exactly once. -/
lemma FindSingleNumber_result_characterization
    (nums : List Int) (h_precond : FindSingleNumber_precond nums) :
    nums.count (FindSingleNumber nums h_precond) = 1 := by
  classical
  rcases exists_count_eq_one nums h_precond with ⟨u, hu_mem, hu_count⟩
  have hu_len : (filterlist u nums).length = 1 := by simp [length_filterlist_eq_count, hu_count]
  have hlen : (filterlist (FindSingleNumber nums h_precond) nums).length = 1 :=
    by simpa [FindSingleNumber] using findUnique_returns_length_one nums nums ⟨u, hu_mem, hu_len⟩
  simpa [length_filterlist_eq_count] using hlen

lemma precond_unique_count_one
    (nums : List Int) (h_precond : FindSingleNumber_precond nums)
    {a b : Int} (ha : a ∈ nums) (hb : b ∈ nums)
    (hca : nums.count a = 1) (hcb : nums.count b = 1) :
    a = b := by
  classical
  unfold FindSingleNumber_precond at h_precond; rcases h_precond with ⟨_hall, huniq⟩
  by_contra hne
  let p : Int → Prop := fun x => nums.count x = 1
  have haF : a ∈ nums.filter p := List.mem_filter.2 ⟨ha, by simp [p, hca]⟩
  have hbF : b ∈ nums.filter p := List.mem_filter.2 ⟨hb, by simp [p, hcb]⟩
  have two_le {α : Type} {l : List α} {a b : α} (ha : a ∈ l) (hb : b ∈ l) (hne : a ≠ b) : 2 ≤ l.length := by
    induction l with
    | nil => cases ha
    | cons c tl ih =>
        have ha' : a = c ∨ a ∈ tl := by simpa using ha
        have hb' : b = c ∨ b ∈ tl := by simpa using hb
        cases ha' with
        | inl hac =>
            cases hb' with
            | inl hbc => exact (hne (by simpa [hac] using hbc.symm)).elim
            | inr hb_tl => exact Nat.succ_le_succ (Nat.succ_le_of_lt (List.length_pos_of_mem hb_tl))
        | inr ha_tl =>
            cases hb' with
            | inl hbc => exact Nat.succ_le_succ (Nat.succ_le_of_lt (List.length_pos_of_mem ha_tl))
            | inr hb_tl => exact le_trans (ih ha_tl hb_tl) (Nat.le_succ tl.length)
  have hlen_ge : 2 ≤ (nums.filter p).length := two_le haF hbF hne
  have count_map_eq_aux : ∀ l : List Int, (l.map (fun x => nums.count x)).count 1 = (l.filter (fun a => nums.count a = 1)).length := by
    intro l; induction l with
    | nil => simp
    | cons a l ih => by_cases h : nums.count a = 1 <;> simp [p, h, ih]
  have hlen_eq_one : (nums.filter p).length = 1 := by simp only [p]; exact (count_map_eq_aux nums).symm.trans huniq
  exact Nat.not_succ_le_self 1 (by simpa [hlen_eq_one] using hlen_ge)

lemma count_eq_two_of_ne_of_count_eq_one
    (nums : List Int) (h_precond : FindSingleNumber_precond nums)
    (r x : Int) (hx : x ∈ nums) (hcr : nums.count r = 1) (hxr : x ≠ r) :
    nums.count x = 2 := by
  classical
  unfold FindSingleNumber_precond at h_precond; rcases h_precond with ⟨hall, huniq⟩
  have precond_counts (x' : Int) (hx' : x' ∈ nums) : nums.count x' = 1 ∨ nums.count x' = 2 := by
    have hall' : ∀ n ∈ (nums.map fun y => nums.count y), (n = 1 ∨ n = 2) := by simpa [List.all_eq_true] using hall
    exact hall' (nums.count x') (List.mem_map.mpr ⟨x', hx', rfl⟩)
  have mem_of_one (a : Int) (h : nums.count a = 1) : a ∈ nums := by
    by_contra hmem; have : nums.count a = 0 := by simp [List.count_eq_zero, hmem]
    exact Nat.zero_ne_one (by simpa [this] using h)
  have h_precond' : FindSingleNumber_precond nums := by unfold FindSingleNumber_precond; exact ⟨hall, huniq⟩
  cases precond_counts x hx with
  | inl h1 => exact (hxr (precond_unique_count_one nums h_precond' hx (mem_of_one r hcr) h1 hcr)).elim
  | inr h2 => exact h2

theorem FindSingleNumber_spec_satisfied (nums: List Int) (h_precond : FindSingleNumber_precond nums) :
    FindSingleNumber_postcond nums (FindSingleNumber nums h_precond) h_precond := by
  classical
  constructor
  · by_contra h0
    have hnil : nums = [] := by simpa using List.length_eq_zero_iff.mp (Nat.eq_zero_of_not_pos h0)
    subst hnil; simp [FindSingleNumber_precond] at h_precond
  constructor
  · simpa [length_filterlist_eq_count] using FindSingleNumber_result_characterization nums h_precond
  · intro x hx
    by_cases h : x = FindSingleNumber nums h_precond
    · exact Or.inl h
    · have hcount := count_eq_two_of_ne_of_count_eq_one nums h_precond
        (FindSingleNumber nums h_precond) x hx (FindSingleNumber_result_characterization nums h_precond) h
      exact Or.inr (by simp [length_filterlist_eq_count, hcount])

-- EVOLVE-BLOCK-END

end verina_advanced_1
